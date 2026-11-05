
# EMERGENCE — Analytic physical world v0.1

**Status:** implemented and tested under bounded conditions. This is a **research instrument**, not a validated general-purpose physics engine. It provides no sensory incidences or representational mechanism in item 3.

## Experimental system

A **single rigid sphere** above a **fixed horizontal plane**. Only the vertical degree of freedom exists. The coordinate is upward-positive; `clearanceM` is the distance between the sphere's lowest point and the plane. The center is at `clearanceM + radiusM`. Time is exposed in simulated **milliseconds**, while the equations use **seconds**.

The physical world owns the truth of positions, motion, forces and collision events. The sensor subsystem is **not connected** in this stage. A learning engine must never receive the world description or the physical event labels as part of a sensory incidence.

### Exact scope and limitations

- Homogeneous gravitational acceleration `gravityMps2 >= 0`.
- No air drag, spin, horizontal degrees of freedom, deformation or rotational inertia.
- Rigid body (point-mass vertical dynamics, plus radius for contact geometry).
- Plane is fixed, cannot move, heat or deform.
- Only one idealized instantaneous collision is handled; further collisions are explicitly **rejected** instead of simulated incorrectly.
- Coefficient of restitution `e` between 0 (fully inelastic vertical collision) and 1 (ideal elastic vertical collision).
- No acoustic or visual phenomena have been implemented, nor does `massKg` by itself determine a material.
- A sphere can be held stationary by an external support and released. This experimental intervention is **not** an autonomously determined action.
- The numerical implementation declares finite parameter bounds; it does not claim accuracy for arbitrary magnitudes, durations, materials or substrates.

## Equations and discontinuity

While in flight, with relative time `t` **after release**, initial clearance `h0`, initial vertical velocity `v0` and gravitational acceleration magnitude `g`:

~~~text
h(t) = h0 + v0 t - 0.5 g t²
v(t) = v0 - g t
a(t) = -g
~~~

The first impact time is the first **approaching** crossing of `h(t)=0`. For `g>0`, a numerically stable form is used: the quadratic root for upward initial velocity, and a rationalized formula for downward initial velocity. Special cases cover zero gravity, zero clearance, initial resting contact and immediate impact with downward velocity.

At impact, vertical velocity changes instantaneously:

~~~text
v_after = -e * v_before
J = m * (v_after - v_before)
E_loss = 0.5 m * (v_before² - v_after²)
~~~

Here `J` is the upward normal impulse (N·s), `m` is sphere mass (kg), and `E_loss` is the idealized amount of kinetic energy not retained in vertical translation. **No claim is made that this energy automatically becomes audible sound or any specific physical modality.** This model does not simulate where dissipation goes.

After an inelastic impact (`e=0`), the body rests on the plane with normal reaction `N = mg`. When a rebound occurs, the analytical flight is evaluated until the second contact time; time queries at or beyond that contact are rejected because a second collision has not yet been implemented.

### Intervention: held then released

`src/world/release-control.js` adds an experimental holding constraint:

- While held (`t < releaseAtMs`): velocity and net acceleration are zero; support force is `mg`; no plane contact force exists.
- At release: `intervention.release` is emitted with the exact timestamp and its source is explicitly the **experimenter**.
- After release: the analytic physical world progresses without further intervention.
- The event `collision.impact`, if present, is **derived from the motion**, not scheduled by the experimenter.

The event IDs are for a researcher audit trail and **never** labels delivered to the future representational domain.

## Canonical scenario

`single-sphere-freefall-impact-v1`:

| Parameter | Value |
| --- | ---: |
| Sphere clearance | 1 m |
| Radius | 0.05 m |
| Mass | 1 kg |
| Initial vertical velocity | 0 m/s |
| Gravity | 9.81 m/s² |
| Restitution coefficient | 0.5 |
| Release at | 0 ms |
| Observation horizon | 800 ms |
| Periodic audit samples | every 100 ms, plus the impact instant |

Analytic first impact: approximately **451.524 ms**. Next contact would occur at approximately **903.047 ms** and lies outside this experimental window. Initial potential energy relative to the plane is **9.81 J**. Immediately before contact it is kinetic; the post-collision vertical kinetic energy is **2.4525 J**; idealized loss is **7.3575 J**.

Two researcher-facing events are generated: `intervention.release` and `collision.impact`. There is **no sound, visual perception or learned unit** in this experiment.

## Validation and adversarial controls

The solver is compared against the closed-form known first-impact time (including `sqrt(2h/g)` for release from rest). A separate `trajectory-verifier.js` checks *invariants* rather than repeating the solver's position equation:

- The geometric relation between sphere center and clearance.
- Energy calculated from measured velocity and height.
- Conservation of mechanical energy within each idealized free-flight segment.
- Constant gravitational acceleration and the `delta-v = -g delta-t` relation.
- Nonpenetration and the proper support normal at rest.
- Momentum/impulse balance, restitution and the collision's kinetic-energy loss.

The tests deliberately inject an incorrect position, an incorrect velocity and an incorrect impulse, and verify that these faults are detected. They also test initial contact, immediate collision, zero gravity, upward initial velocity, large downward speed, unsupported second impacts, input bounds and deterministic repeated reads.

These checks validate the **declared idealization**, not the adequacy of the idealization for realistic acoustic, optical or bodily phenomena. A full independent numerical solver, cross-platform tolerances and richer environmental ambiguity tests remain future work under item 5 of the canonical roadmap.

## Commands

~~~sh
npm test
npm run experiment:world1d              # compact result
npm run experiment:world1d:json > world-run.json
npm run experiment:world1d:csv > world-states.csv
npm run experiment:world1d:events > world-events.csv
~~~

The JSON manifest includes model ID/version, complete physical parameters, intervention, observation times and the Git revision when available. CSV streams are useful for inspection but not standalone full research packages. At a later stage, the physical world will be coupled to transducers **without** giving its truth to the constitution engine.

## Source and provenance

All new implementation belongs to [EMERGENCE](https://github.com/paulosince/emergence). The [TEMPO](https://github.com/paulosince/temporotopological-relations) project is frozen and has not been changed. This physical model does not invoke TEMPO or claim that TEMPO has already constituted units.
