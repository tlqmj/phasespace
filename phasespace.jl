using Makie, Observables, StaticArrays, AbstractPlotting

include("simulation.jl")
include("plotting.jl")
include("util.jl")


r(θ) = (sin(θ), -cos(θ))
p_θ₀(γ) = sqrt(2*9.8*γ)
energy(θ, p_θ) = 0.5*p_θ^2 - 9.8*cos(θ)

θ = Node(0.0)
p_θ = Node(0.0)
E = Node(0.0)

γ = Node(0.0)
on(γ) do val
    θ[] = 0.0
    p_θ[] = p_θ₀(val)
    E[] = 9.8(val - 1)
end

γ[] = 0.95

scene = instantiate_plot(θ, p_θ, E, γ);
update_cam!(scene.children[1], FRect3D(Vec3f0(0), Vec3f0(1)))
@async sim!(θ, p_θ, scene=scene)
